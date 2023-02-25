const logger = require("../lib/logger");

const { publisherApprovalStatuses } = require("../database/database-constants");
const {
  getPublisherRequestByStatus, 
} = require("../database/queries/publisherRequested.query");

const { getOrganizationsList } = require("../lib/ckan-api");

const { getPendingApplicationsSortFields } = require("../lib/ckan-constants");
const { pagination } = require("../lib/common/utils");
const { dataStringify } = require("../lib/helper");
const { sortField } = require("../database/util");
const { rows } = require("../lib/constants");

const adminDashboardView = async (req, res, next) =>
  res.render("admin/dashboard.njk");

const managePublishersView = async (req, res, next) =>
  res.render("admin/publishers.njk");

const pendingPublisherView = async (req, res, next) => {
  try {
    

    const { page: currentPage = 1, sort } = req.query;
    const start = rows * (currentPage - 1);

    const sortFields = getPendingApplicationsSortFields();
    const [sortValue , order] = sortField(sort,sortFields)

    const pendingApplications = await getPublisherRequestByStatus(
      publisherApprovalStatuses.PENDING,
      start,
      rows,
      order
    );


    // Pagination functionality
    const numberOfPages = Math.ceil(pendingApplications.count / rows);
    const neighbourPage = 2;
    const pages = pagination(
      Number(neighbourPage),
      Number(currentPage),
      numberOfPages
    );

    const paginationProps = { numberOfPages, pages, currentPage };

    const organization_list = await getOrganizationsList();
    const organisations = encodeURI(dataStringify(organization_list));
    const pendingPublisherApplications = encodeURI(dataStringify(pendingApplications.rows));
    const csvHeaders = encodeURI(dataStringify([
      {
          label: "datetime registered interest",
          key: "createdAt"
      }, {
          label: "full name",
          key: "full_name"
      }, {
          label: "email address",
          key: "email_address"
      }, {
          label: "organisation name",
          key: "organisation_name"
      }, {
          label: "status",
          key: "status"
      }
  ]))

    
    const paramValues  = {sortValue}

    res.render("admin/manage-publishers/pending.njk", {
      ...paginationProps,
      sortFields,
      organisations,
      pendingApplications: pendingApplications.rows,
      paramValues,
      pendingPublisherApplications,
      csvHeaders
    });
  } catch (e) {
    logger.info(`PendingApplicationsError: ${e}`);
    next();
  }
};

module.exports = {
  adminDashboardView,
  managePublishersView,
  pendingPublisherView,
};
