// Link Card Component
function createLinkCard(link) {
  const card = document.createElement('div');
  card.className = 'link-card';
  card.innerHTML = `
    <h3>${link.title}</h3>
    <p>${link.overview}</p>
    <a href="${link.url}" target="_blank" class="button">Visit Link</a>
    <span class="type-badge">${link.type}</span>
    <div class="meta">
      <span>Shared by: ${link.author.username}</span>
      <span>Date: ${new Date(link.createdAt).toLocaleDateString()}</span>
    </div>
  `;
  
  // Add event listeners for interactive effects
  const button = card.querySelector('.button');
  button.addEventListener('click', function() {
    // The CSS handles the visual effects
  });
  
  return card;
}

// Link List Component
function renderLinkList(links, container) {
  container.innerHTML = '';
  
  if (links.length === 0) {
    container.innerHTML = '<p>No links found.</p>';
    return;
  }
  
  links.forEach(link => {
    const card = createLinkCard(link);
    container.appendChild(card);
  });
}

// Link Filter Component
function setupLinkFilters(container, onFilter) {
  const filterForm = document.createElement('form');
  filterForm.className = 'link-filter-form';
  filterForm.innerHTML = `
    <div class="filter-group">
      <input type="text" id="title-search" placeholder="Search by title" class="search-input">
      <input type="text" id="overview-search" placeholder="Search by overview" class="search-input">
      <select id="type-filter" class="type-select">
        <option value="">All Types</option>
        <option value="article">Article</option>
        <option value="video">Video</option>
        <option value="course">Course</option>
        <option value="tool">Tool</option>
      </select>
      <button type="submit" class="button">Filter</button>
    </div>
  `;
  
  container.appendChild(filterForm);
  
  // Add event listeners
  filterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const filters = {
      title: document.getElementById('title-search').value,
      overview: document.getElementById('overview-search').value,
      type: document.getElementById('type-filter').value
    };
    
    onFilter(filters);
  });
  
  // Add interactive effects to buttons
  const buttons = filterForm.querySelectorAll('.button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      // CSS handles the hover effect
    });
    
    button.addEventListener('mousedown', function() {
      // CSS handles the active effect
    });
  });
}

// Link API Service
const LinkService = {
  async getLinks(filters = {}) {
    let queryParams = new URLSearchParams();
    
    if (filters.title) queryParams.append('title', filters.title);
    if (filters.overview) queryParams.append('overview', filters.overview);
    if (filters.type) queryParams.append('type', filters.type);
    
    const response = await fetch(`/api/links?${queryParams.toString()}`);
    const data = await response.json();
    return data.links;
  },
  
  async createLink(linkData) {
    const token = localStorage.getItem('jwt');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch('/api/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ link: linkData })
    });
    
    const data = await response.json();
    return data.link;
  }
};

// Initialize Link UI
function initLinkUI() {
  const linkListContainer = document.getElementById('link-list-container');
  const filterContainer = document.getElementById('link-filter-container');
  
  if (!linkListContainer || !filterContainer) {
    console.error('Link containers not found');
    return;
  }
  
  // Setup filters
  setupLinkFilters(filterContainer, async (filters) => {
    try {
      const links = await LinkService.getLinks(filters);
      renderLinkList(links, linkListContainer);
    } catch (error) {
      console.error('Error fetching links:', error);
      linkListContainer.innerHTML = '<p>Error loading links. Please try again.</p>';
    }
  });
  
  // Initial load of links
  LinkService.getLinks()
    .then(links => renderLinkList(links, linkListContainer))
    .catch(error => {
      console.error('Error fetching links:', error);
      linkListContainer.innerHTML = '<p>Error loading links. Please try again.</p>';
    });
}

// Export components for use in other files
window.LinkComponents = {
  createLinkCard,
  renderLinkList,
  setupLinkFilters,
  LinkService,
  initLinkUI
};
